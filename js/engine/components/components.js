(function()
{
    'use strict';
    window.ENGINE = window.ENGINE ||
    {};

    ENGINE.components = {};

    ENGINE.components.loader = function(path, components, done)
    {
        this.path = path;
        this.callback = done;
        this.components = components;
        this.componentTickets = [];
        this.loadingDone = function()
        {
            for (var i = 0; i < this.componentTickets.length; i++)
            {
                if (!this.componentTickets[i].closed())
                {
                    return;
                }
            }

            this.callback();
        };

        for (var i = 0; i < this.components.length; i++)
        {
            this.componentTickets[i] = new ENGINE.ticket(this.components[i]);
        }

        var self = this;

        this.loadScript = function(num)
        {
            $.getScript(this.path + this.components[num] + ".js", function(data, textStatus, jqxhr)
            {
                self.componentTickets[num].close();
                self.loadingDone();
            });
        };

        this.load = function()
        {
            for (var i = 0; i < this.components.length; i++)
            {
                this.loadScript(i);
            }
        };
    };

    ENGINE.components.load = function(path, components)
    {
        var ticket = new ENGINE.ticket("components");

        new ENGINE.components.loader(path, components, function()
        {
            ticket.close();
        }).load();
    };
})();
