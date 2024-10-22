# Introduction

This tool to view information about historical redemptions and liquidations on individual Troves. It also views decreases in Stability Pool stakes during liquidation events. This repository is optimized for Pulsechain Liquity forks Liquid Loans, Earn Protocol and Flex Protocol.

This app was created because there was no tooling in the protocol front ends to show the user when they lost collateral due redemptions, or when they lose stability pool stake amounts during liquidation events. This might be useful for people that want use wallet tracking / txn logging software like Koinly that will track user initiated txns such as opening or adjusting a trove but won't track when a trove gets liquidated or redeemed against.